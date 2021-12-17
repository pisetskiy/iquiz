package by.pisetskiy.iquiz.model.entity;

import java.util.HashSet;
import java.util.Set;
import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@NoArgsConstructor
@Entity
public class JobPosition extends BaseEntity {

    private String name;

    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(name = "job_position_quiz",
            joinColumns = @JoinColumn(name = "job_position_id"),
            inverseJoinColumns = @JoinColumn(name = "quiz_id"))
    @ToString.Exclude
    private Set<Quiz> quizes = new HashSet<>();

    public void addQuiz(Quiz quiz) {
        this.quizes.add(quiz);
    }

    public void removeQuiz(Quiz quiz) {
        this.quizes.remove(quiz);
    }
}
