package by.pisetskiy.iquiz.model.entity;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import lombok.*;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.Formula;

@Getter
@Setter
@ToString
@NoArgsConstructor
@Entity
@SuperBuilder
public class Employee extends BaseEntity {

    private String firstName;
    private String middleName;
    private String lastName;
    private String email;
    @Formula("(select if(u.role = 'ADMIN', 1, 0) from user u where u.employee_id = id)")
    @Builder.Default
    private Boolean isAdmin = Boolean.FALSE;
    @Formula("(select count(a.id) from appointment a where a.employee_id = id and a.state = 'CREATED')")
    private Integer appointments;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "job_position_id")
    @ToString.Exclude
    private JobPosition jobPosition;
}
